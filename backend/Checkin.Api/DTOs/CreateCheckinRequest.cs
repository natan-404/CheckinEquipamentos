namespace Checkin.Api.DTOs;

public class CreateCheckinRequest
{
    public string Nome { get; set; } = "";

    public string Email { get; set; } = "";

    public string Departamento { get; set; } = "";

    public string PublicIp { get; set; } = "";

    public string ComputerName { get; set; } = "";

    public string Manufacturer { get; set; } = "";

    public string Model { get; set; } = "";

    public string SerialNumber { get; set; } = "";

    public string Cpu { get; set; } = "";

    public int RamGb { get; set; }

    public string Gpu { get; set; } = "";

    public string DiskModel { get; set; } = "";

    public long DiskSizeGb { get; set; }

    public string OperatingSystem { get; set; } = "";

    public string DeviceIdentifier { get; set; } = "";
}