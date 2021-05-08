using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartTutorial.Domain;

namespace SmartTutorial.EFMapping
{
    public class QuestionConfig : IEntityTypeConfiguration<Question>
    {
        public void Configure(EntityTypeBuilder<Question> builder)
        {
            builder.Property(e => e.Text)
                .IsRequired()
                .HasMaxLength(150);
            builder.Property(e => e.Answer)
                .IsRequired()
                .HasMaxLength(150);

            builder.HasOne(d => d.Topic)
                .WithMany(p => p.Questions)
                .HasForeignKey(d => d.TopicId);
        }
    }
}