using Microsoft.AspNetCore.Identity;

namespace SmartTutorial.Domain.Auth
{
    public class User : IdentityUser<int>
    {
        public int Rating { get; set; }
    }
}
