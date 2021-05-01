using System.Collections.Generic;

namespace SmartTutorial.Domain
{
    public class Topic : BaseEntity
    {
        public Topic()
        {
            Questions = new List<Question>();
        }
        public string Name { get; set; }
        public string Text { get; set; }
        public string Content { get; set; }
        public int Order { get; set; }

        public int SubjectId { get; set; }
        public virtual Subject Subject { get; set; }

        public virtual List<Question> Questions { get; set; }
    }
}
