namespace SmartTutorial.Domain
{
    public class Option : BaseEntity
    {
        public string Text { get; set; }

        public int QuestionId { get; set; }
        public virtual Question Question { get; set; }
    }
}
