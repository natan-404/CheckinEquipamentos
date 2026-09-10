using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Checkin.infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAssetTagToDevice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AssetTag",
                table: "Devices",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssetTag",
                table: "Devices");
        }
    }
}
