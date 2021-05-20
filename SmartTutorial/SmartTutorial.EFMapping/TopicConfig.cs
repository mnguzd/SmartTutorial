using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartTutorial.Domain;

namespace SmartTutorial.EFMapping
{
    public class TopicConfig : IEntityTypeConfiguration<Topic>
    {
        public void Configure(EntityTypeBuilder<Topic> builder)
        {
            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(e => e.Order).IsRequired();

            builder.Property(e => e.Content)
                .IsRequired()
                .HasMaxLength(100000);

            builder.HasOne(d => d.Subject)
                .WithMany(p => p.Topics)
                .HasForeignKey(d => d.SubjectId);
        }
    }
}