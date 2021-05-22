using System.Collections.Generic;
using SmartTutorial.Domain.Auth;

namespace SmartTutorial.Domain
{
    public class Question : BaseEntity
    {
        public Question()
        {
            Answers = new List<Answer>();
        }
        public string Text { get; set; }
        public string Answer { get; set; }

        public int TopicId { get; set; }
        public virtual Topic Topic { get; set; }

        public virtual ICollection<User> Users { get; set; }

        public virtual List<Answer> Answers { get; set; }
    }
}
