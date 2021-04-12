using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartTutorial.API.Migrations
{
    public partial class DeletedRowVersionForSure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Subjects");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Subjects",
                type: "rowversion",
                rowVersion: true,
                nullable: true);
        }
    }
}
