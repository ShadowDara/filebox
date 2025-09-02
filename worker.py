import os

def get_folder_info(path):
    total_size = 0
    file_count = 0

    for dirpath, dirnames, filenames in os.walk(path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            if os.path.isfile(fp):  # Nur echte Dateien zählen
                total_size += os.path.getsize(fp)
                file_count += 1

    return total_size, file_count
