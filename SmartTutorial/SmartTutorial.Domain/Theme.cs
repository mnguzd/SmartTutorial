using System.Collections.Generic;

namespace SmartTutorial.Domain
{
    public class Theme : BaseEntity
    {
        public Theme()
        {
            Subjects = new List<Subject>();
        }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public virtual List<Subject> Subjects { get; set; }

    }
}
