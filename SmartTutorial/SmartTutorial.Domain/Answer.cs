namespace SmartTutorial.Domain
{
    public class Answer : BaseEntity
    {
        public string Text { get; set; }
        public bool IsTrue { get; set; }

        public int QuestionId { get; set; }
        public virtual Question Question { get; set; }
    }
}
