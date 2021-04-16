using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartTutorial.Domain;

namespace SmartTutorial.EFMapping
{
    public class ThemeConfig : IEntityTypeConfiguration<Theme>
    {
        public void Configure(EntityTypeBuilder<Theme> builder)
        {
            builder.ToTable("Themes");
            builder.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(20);
            builder.Property(e => e.ImageUrl).
                IsRequired();
            builder.Property(e => e.Description).HasMaxLength(300).IsRequired();
        }
    }
}
