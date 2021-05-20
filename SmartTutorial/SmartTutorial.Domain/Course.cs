using System.Collections.Generic;

namespace SmartTutorial.Domain
{
    public class Course : BaseEntity
    {
        public Course()
        {
            Subjects = new List<Subject>();
        }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public virtual List<Subject> Subjects { get; set; }

    }
}
