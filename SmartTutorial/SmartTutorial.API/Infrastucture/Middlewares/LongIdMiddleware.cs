using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace SmartTutorial.API.Infrastucture.Middlewares
{
    public class LongIdMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public LongIdMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<LongIdMiddleware>();
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var id = context.Request.Path.Value.ToLower();
            if (id.Contains("subject",System.StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Getting information form subjects");
            }
                await _next.Invoke(context);
        }
    }
}
