<?php

class FileHandler {
    public $filename;

    public function __construct($filename) {
        $this->filename = $filename;
    }

    public function __destruct() {
        if (file_exists($this->filename)) {
            echo "--- Content of {$this->filename} ---\n";
            echo file_get_contents($this->filename);
            echo "\n--- End of content ---\n";
        } else {
            echo "File not found: {$this->filename}\n";
        }
    }
}
