using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace SmartTutorial.Domain.Auth
{
    public class User : IdentityUser<int>
    {
        public int Rating { get; set; }
        public string Country { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarPath { get; set; }
        public string RefreshToken { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
    }
}
