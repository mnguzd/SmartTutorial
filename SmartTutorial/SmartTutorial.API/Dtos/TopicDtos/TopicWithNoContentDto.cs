using SmartTutorial.API.Dtos.SubjectDtos;

namespace SmartTutorial.API.Dtos.TopicDtos
{
    public class TopicWithNoContentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public SubjectDto Subject { get; set; }
    }
}
