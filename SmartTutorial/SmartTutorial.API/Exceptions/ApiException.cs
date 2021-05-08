using System;
using System.Net;

namespace SmartTutorial.API.Exceptions
{
    public class ApiException : Exception
    {
        public ApiException(HttpStatusCode code, string message) : base(message)
        {
            Code = code;
        }

        public HttpStatusCode Code { get; }
    }
}