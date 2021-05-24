using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.CourseDtod
{
    public class AddCourseDto
    {
        [Required]
        [StringLength(20, MinimumLength = 2)]
        public string Name { get; set; }

        [Required]
        [StringLength(300, MinimumLength = 10)]
        public string Description { get; set; }

        [Required]
        [Url]
        public string ImageUrl { get; set; }
    }
}
