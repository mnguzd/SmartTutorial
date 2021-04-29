using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.UserDtos
{
    public class UserForLoginDto
    {
        [Required]
        [StringLength(20)]
        [MinLength(4)]
        public string Username { get; set; }

        [Required]
        [StringLength(80)]
        [MinLength(8)]
        public string Password { get; set; }
    }
}
