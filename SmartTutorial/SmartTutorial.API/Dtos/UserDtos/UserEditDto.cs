using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.UserDtos
{
    public class UserEditDto
    {
        [StringLength(20, MinimumLength = 2)]
        [Required]
        public string Firstname { get; set; }

        [StringLength(20, MinimumLength = 2)]
        [Required]
        public string Lastname { get; set; }

        [EmailAddress]
        [Required]
        public string Email { get; set; }

        [StringLength(15, MinimumLength = 2)]
        public string Country { get; set; }
    }
}
