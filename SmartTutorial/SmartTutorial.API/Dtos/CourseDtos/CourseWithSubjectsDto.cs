using SmartTutorial.API.Dtos.SubjectDtos;
using System.Collections.Generic;

namespace SmartTutorial.API.Dtos.CourseDtod
{
    public class CourseWithSubjectsDto
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public string Description { get; set; }
        public List<SubjectDto> Subjects { get; set; }
    }
}
