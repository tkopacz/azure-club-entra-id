namespace net_api
{
    public class Util
    {
        public static bool HasScope(System.Security.Claims.ClaimsPrincipal user, string scope)
        {
            if (user is null) return false;

            // Primary v2 endpoint claim
            var scopeClaim = user.FindFirst("scp")?.Value;

            // Fallback (some libraries map differently)
            if (string.IsNullOrEmpty(scopeClaim))
                scopeClaim = user.FindFirst("http://schemas.microsoft.com/identity/claims/scope")?.Value;

            if (string.IsNullOrEmpty(scopeClaim))
                return false;

            // Split space separated scopes
            var output = scopeClaim
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Contains(scope, StringComparer.Ordinal);
            return output;
        }
        public static bool HasRole(System.Security.Claims.ClaimsPrincipal user, string role)
        {
            if (user is null) return false;

            var rolesClaim = user.FindFirst("roles")?.Value;

            // Fallback (some libraries map differently)
            if (string.IsNullOrEmpty(rolesClaim))
                rolesClaim = user.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

            if (string.IsNullOrEmpty(rolesClaim))
                return false;

            // Split space separated scopes
            var output = rolesClaim.Equals(role,StringComparison.OrdinalIgnoreCase); //Example - our logic
            return output;
        }
    }
}
