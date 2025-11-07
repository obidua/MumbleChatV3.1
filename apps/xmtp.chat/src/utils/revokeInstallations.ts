/**
 * Utility to revoke old XMTP installations
 * Use this when you hit the 10/10 installation limit
 */

import type { Client } from "@xmtp/browser-sdk";

export async function revokeOldInstallations(client: Client) {
  try {
    // Get all installations for this inbox
    const installations = await client.inboxState.installations();

    console.log(`Found ${installations.length} installations`);

    // Keep the current installation and the most recent one
    // Revoke all others
    const currentInstallationId = client.installationId;
    const sortedInstallations = installations
      .filter((inst) => inst.installationId !== currentInstallationId)
      .sort((a, b) => b.createdAt - a.createdAt);

    // Revoke all but the most recent 2 installations (including current)
    const toRevoke = sortedInstallations.slice(1); // Keep the most recent old one

    console.log(`Revoking ${toRevoke.length} old installations...`);

    for (const installation of toRevoke) {
      try {
        await client.revokeInstallation(installation.installationId);
        console.log(`✅ Revoked installation: ${installation.installationId}`);
      } catch (error) {
        console.error(
          `❌ Failed to revoke ${installation.installationId}:`,
          error,
        );
      }
    }

    console.log("✅ Finished revoking old installations");
    return {
      total: installations.length,
      revoked: toRevoke.length,
      remaining: installations.length - toRevoke.length,
    };
  } catch (error) {
    console.error("Failed to revoke installations:", error);
    throw error;
  }
}

/**
 * Manual revoke by installation ID
 */
export async function revokeInstallationById(
  client: Client,
  installationId: string,
) {
  try {
    await client.revokeInstallation(installationId);
    console.log(`✅ Revoked installation: ${installationId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to revoke ${installationId}:`, error);
    return false;
  }
}

/**
 * List all installations
 */
export async function listInstallations(client: Client) {
  try {
    const installations = await client.inboxState.installations();
    console.log(`Total installations: ${installations.length}/10`);
    installations.forEach((inst, index) => {
      console.log(
        `${index + 1}. ID: ${inst.installationId}, Created: ${new Date(inst.createdAt * 1000).toLocaleString()}`,
      );
    });
    return installations;
  } catch (error) {
    console.error("Failed to list installations:", error);
    throw error;
  }
}
