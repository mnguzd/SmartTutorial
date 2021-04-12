using System.Collections.Generic;

namespace SmartTutorial.Domain
{
    public class Question : BaseEntity
    {
        public Question()
        {
            Answers = new List<Answer>();
        }
        public string Text { get; set; }

        public int TopicId { get; set; }
        public virtual Topic Topic { get; set; }

        public virtual List<Answer> Answers { get; set; }
    }
}
