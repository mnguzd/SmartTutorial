using Microsoft.AspNetCore.Http;
using SmartTutorial.API.Infrastucture.ExceptionsHandling;
using System;
using System.Net;
using System.Threading.Tasks;

namespace SmartTutorial.API.Infrastucture.Middleware
{
    public class SmartTutorialExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        public SmartTutorialExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex);
            }
        }
        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return context.Response.WriteAsync(new ErrorDetails()
            {
                StatusCode = context.Response.StatusCode,
                Message = exception.Message
            }.ToString());
        }
    }
}
