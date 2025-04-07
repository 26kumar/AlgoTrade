import subprocess
import sys
import time
import os

def run_command(command, description):
    print(f"\n{'='*50}")
    print(f"Starting: {description}")
    print(f"{'='*50}\n")
    
    try:
        # Run the command and capture its output
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',  # Explicitly set UTF-8 encoding
            bufsize=1,
            universal_newlines=True
        )
        
        # Print output in real-time
        while True:
            output = process.stdout.readline()
            error = process.stderr.readline()
            
            if output == '' and error == '' and process.poll() is not None:
                break
                
            if output:
                print(output.strip())
            if error:
                # Filter out common warnings
                if not ('InconsistentVersionWarning' in error or 'Trying to unpickle estimator' in error):
                    print(f"ERROR: {error.strip()}")
                
        # Check for any errors
        if process.returncode != 0:
            print(f"\nError running {description}")
            print(f"Return code: {process.returncode}")
            # Print any remaining error output
            remaining_error = process.stderr.read()
            if remaining_error:
                # Filter out version warnings
                filtered_error = '\n'.join([line for line in remaining_error.splitlines() 
                                          if not ('InconsistentVersionWarning' in line or 'Trying to unpickle estimator' in line)])
                if filtered_error.strip():
                    print(f"Error details: {filtered_error.strip()}")
            return False
            
        return True
        
    except Exception as e:
        print(f"\nError running {description}: {str(e)}")
        return False

def main():
    # Get the directory of the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Change to the script directory
    os.chdir(script_dir)
    
    print("Starting all services...")
    
    # Check if files exist
    if not os.path.exists("server.py"):
        print("Error: server.py not found in the current directory")
        return
        
    if not os.path.exists("server.js"):
        print("Error: server.js not found in the current directory")
        return
        
    if not os.path.exists("package.json"):
        print("Error: package.json not found in the current directory")
        return
    
    # Run Python server with UTF-8 encoding and suppress warnings
    if not run_command("python -X utf8 -W ignore server.py", "Python Server"):
        print("Failed to start Python server")
        return
        
    # Run Node.js server
    if not run_command("node server.js", "Node.js Server"):
        print("Failed to start Node.js server")
        return
        
    # Run npm dev
    if not run_command("npm run dev", "NPM Dev Server"):
        print("Failed to start NPM dev server")
        return
        
    print("\nAll services started successfully!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopping all services...")
        sys.exit(0) 