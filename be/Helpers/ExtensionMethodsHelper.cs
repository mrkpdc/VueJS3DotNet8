﻿using System.Security.Claims;
using be.Common;

namespace be.Helpers
{
    public static class ExtensionMethodsHelper
    {
        public static bool CheckPolicy(this ClaimsPrincipal user, string claimName, string? claimValue = null)
        {
            if (user.HasClaim(claimName, claimValue == null ? ConstantValues.Auth.Claims.Values.True : claimValue)
                || user.HasClaim(ConstantValues.Auth.Claims.Types.CANDOANYTHING, ConstantValues.Auth.Claims.Values.True))
                return true;
            return false;
        }        
    }
}