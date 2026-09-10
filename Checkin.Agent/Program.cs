using System.Threading;
using System.Management;
using System.Net.Http.Json;

string GetWmi(string classe, string propriedade)
{
    try
    {
        using var searcher =
            new ManagementObjectSearcher($"SELECT * FROM {classe}");

        foreach (ManagementObject obj in searcher.Get())
        {
            return obj[propriedade]?.ToString() ?? "";
        }
    }
    catch { }

    return "";
}

Console.WriteLine("Coletando hardware...");

var client = new HttpClient();

var uuid =
    GetWmi("Win32_ComputerSystemProduct", "UUID");

var userResponse = await client.GetAsync(
    $"http://localhost:5011/api/checkin/device/{uuid}"
);

var json = await userResponse.Content.ReadAsStringAsync();

Console.WriteLine("JSON RECEBIDO:");
Console.WriteLine(json);

var usuario = System.Text.Json.JsonSerializer.Deserialize<UsuarioDto>(
    json,
    new System.Text.Json.JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    }
);

Console.WriteLine("=== USUARIO ===");
Console.WriteLine($"Nome: {usuario?.Nome}");
Console.WriteLine($"Email: {usuario?.Email}");
Console.WriteLine($"Departamento: {usuario?.Departamento}");

var payload = new
{
    nome = usuario?.Nome ?? "",
    email = usuario?.Email ?? "",
    departamento = usuario?.Departamento ?? "",

    computerName = Environment.MachineName,

    manufacturer = GetWmi("Win32_BaseBoard", "Manufacturer"),
    model = GetWmi("Win32_BaseBoard", "Product"),
    serialNumber = GetWmi("Win32_BIOS", "SerialNumber"),

    cpu = GetWmi("Win32_Processor", "Name"),

    ramGb = Convert.ToInt32(
        Math.Round(
            Convert.ToDouble(
                GetWmi("Win32_ComputerSystem", "TotalPhysicalMemory")
            ) / 1024 / 1024 / 1024
        )
    ),

    gpu = GetWmi("Win32_VideoController", "Name"),

    diskModel = GetWmi("Win32_DiskDrive", "Model"),

    diskSizeGb = Convert.ToInt32(
        Math.Round(
            Convert.ToDouble(
                GetWmi("Win32_DiskDrive", "Size")
            ) / 1024 / 1024 / 1024
        )
    ),

    operatingSystem = Environment.OSVersion.VersionString,

    deviceIdentifier = uuid,

    publicIp = ""
};

var response = await client.PostAsJsonAsync(
    "http://localhost:5011/api/checkin",
    payload
);

Console.WriteLine(await response.Content.ReadAsStringAsync());

Console.WriteLine("Inventário enviado.");

Thread.Sleep(2000);

public class UsuarioDto
{
    public string Nome { get; set; } = "";
    public string Email { get; set; } = "";
    public string Departamento { get; set; } = "";
}