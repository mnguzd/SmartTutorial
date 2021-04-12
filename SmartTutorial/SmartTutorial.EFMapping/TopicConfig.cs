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
                   .HasMaxLength(20);

            builder.Property(e => e.Text)
                .IsRequired()
                .HasMaxLength(10000);

            builder.HasOne(d => d.Subject)
                .WithMany(p => p.Topics)
                .HasForeignKey(d => d.SubjectId);
            
        }
    }
}
