import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

export function runPythonScript(scriptPath: string): (args: any) => Promise<string> {
    return (args) => new Promise((resolve, reject) => {
        // console.log('args: ', args);
        const python: ChildProcessWithoutNullStreams = spawn(
            process.env.PYTHON_INTERPRETER || 'python3', 
            [scriptPath, JSON.stringify(args)]
        );

        let dataString = '';
        let errorString = '';

        // python.stdout.on('data', (data: Buffer) => dataString += data.toString());
        // python.stderr.on('data', (data: Buffer) => errorString += data.toString());
        python.stdout.on('data', (data: Buffer) => {
            // console.log('Python STDOUT:', data.toString());
            dataString += data.toString();
        });

        python.stderr.on('data', (data: Buffer) => {
            console.log('Python STDERR:', data.toString());
            errorString += data.toString();
        });

        python.on('close', (code: number) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}: ${errorString}`));
            } else {
                resolve(dataString);
            }
        });

        python.on('error', (err: Error) => reject(new Error(`Failed to start Python script: ${err.message}`)));
    });
}
