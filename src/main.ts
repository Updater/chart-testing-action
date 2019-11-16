import * as core from '@actions/core';
import {ChartTesting} from "./ct";

const ImageInput = "image";
const ConfigFileInput = "configFile";
const CommandInput = "command";
const InstallLocalPathProvisionerInput = "useLocalPathProvisioner";
const KubeconfigFileInput = "kubeconfigFile";

export function createChartTesting(): ChartTesting {
    const image = core.getInput(ImageInput);
    const configFile = core.getInput(ConfigFileInput);
    const command = core.getInput(CommandInput, {required: true});
    const kubeconfigFile = core.getInput(KubeconfigFileInput, {required: true});

    return new ChartTesting(image, configFile, command, kubeconfigFile)
}

async function run() {
    try {
        const installLocalPathProvisioner = core.getInput(InstallLocalPathProvisionerInput);

        const ct = createChartTesting();
        await ct.verifyCluster();

        if (installLocalPathProvisioner) {
            await ct.installLocalPathProvisioner();
        }

        await ct.runChartTesting()
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();