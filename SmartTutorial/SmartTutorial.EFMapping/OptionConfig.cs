using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartTutorial.Domain;

namespace SmartTutorial.EFMapping
{
    public class OptionConfig : IEntityTypeConfiguration<Option>
    {
        public void Configure(EntityTypeBuilder<Option> builder)
        {
            builder.Property(e => e.Text)
                .IsRequired()
                .HasMaxLength(150);

            builder.HasOne(d => d.Question)
                .WithMany(p => p.Options)
                .HasForeignKey(d => d.QuestionId);
        }
    }
}