using Microsoft.AspNetCore.Builder;
using SmartTutorial.API.Infrastucture.Middleware;

namespace SmartTutorial.API.Infrastucture.Extensions
{
    public static class ExceptionMiddlewareExtension
    {
        public static void ConfigureCustomExceptionMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<SmartTutorialExceptionMiddleware>();
        }
    }
}