"use server";

import { FreestyleSandboxes } from "freestyle-sandboxes";

export async function createChat(name: string) {
  try {
    const freestyle = new FreestyleSandboxes();

    const { repoId } = await freestyle.createGitRepository({
      name: name,
      public: true,
      source: {
        url: "https://github.com/MrUprizing/yuno-template",
      },
      devServers: {
        preset: "nextJs",
      },
    });

    console.log("Created repo with ID:", repoId);

    const { ephemeralUrl } = await freestyle.requestDevServer({
      repoId: repoId,
    });

    return {
      repoId,
      ephemeralUrl,
    };
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}
