package com.kitika.demo.audit;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kitika.demo.service.AuditService;

@Aspect
@Component
public class AuditAspect {

    @Autowired
    private AuditService auditService;

    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Intercepte les méthodes publiques des services du package com.kitika.demo.service
     * tu peux ajuster le pointcut (exclure AuditService lui-même etc.)
     */
    @Around("execution(public * com.kitika.demo.service.*.*(..)) && !within(com.kitika.demo.service.AuditService)")
    public Object aroundServiceMethods(ProceedingJoinPoint pjp) throws Throwable {
        String utilisateur = "SYSTEM";
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) utilisateur = auth.getName();

        String method = pjp.getSignature().getName();
        String className = pjp.getTarget().getClass().getSimpleName();

        Object result = null;
        String action = guessActionFromMethod(method);
        String details = "";
        String recordId = "";

        try {
            // serialize args (sensible: avoid huge/secret data)
            try { details = mapper.writeValueAsString(pjp.getArgs()); } catch(Exception e) { details = "args-serialization-failed"; }

            result = pjp.proceed();

            // try extract id from result if present
            try {
                if (result != null) {
                    // if result has getId() method
                    Object maybeId = result.getClass().getMethod("getId").invoke(result);
                    if (maybeId != null) recordId = String.valueOf(maybeId);
                }
            } catch (NoSuchMethodException ns) {
                // ignore
            } catch (Exception ex) {
                // ignore
            }

            // success log
            auditService.save(action, className.replace("Service", ""), recordId, utilisateur, "SUCCESS: " + details);
            return result;
        } catch (Throwable ex) {
            // error log
            String err = ex.getMessage() != null ? ex.getMessage() : ex.toString();
            auditService.save(action, className.replace("Service", ""), recordId, utilisateur, "ERROR: " + err + " | args: " + details);
            throw ex;
        }
    }

    private String guessActionFromMethod(String method) {
        method = method.toLowerCase();
        if (method.startsWith("create") || method.startsWith("save") || method.startsWith("add") || method.startsWith("creer")) return "CREATE";
        if (method.startsWith("update") || method.startsWith("modifier")) return "UPDATE";
        if (method.startsWith("delete") || method.startsWith("supprimer") || method.startsWith("remove")) return "DELETE";
        if (method.contains("checkin")) return "CHECKIN";
        if (method.contains("checkout")) return "CHECKOUT";
        if (method.contains("generer") || method.contains("facture")) return "GENERER_FACTURE";
        return method.toUpperCase();
    }
}
