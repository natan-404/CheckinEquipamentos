namespace Checkin.Domain.Entities;

public class Device
{
    public Guid Id { get; set; }

    public string DeviceCode { get; set; } = "";

    public string AssetTag { get; set; } = "";

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

    public string UsuarioNome { get; set; } = "";

public string UsuarioEmail { get; set; } = "";

public string UsuarioDepartamento { get; set; } = "";

}