using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.TopicDtos
{
    public class AddTopicDto
    {
        [StringLength(30, MinimumLength = 2)]
        [Required]
        public string Name { get; set; }

        [StringLength(100000)]
        [Required]
        public string Content { get; set; }

        [Required] public int Order { get; set; }

        [Required] public int SubjectId { get; set; }
    }
}