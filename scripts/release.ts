import { build as electronBuild } from 'electron-builder';
import { run } from 'shell-commands';

const build = async () => {
  await run(`
    rm -rf .parcel-cache
    rm -rf build
    parcel build --no-source-maps
  `);
};

const main = async () => {
  await build();
  await run(`
    rm -rf dist
  `);
  const inputs = new Set(process.argv);
  if (inputs.has('--dir')) {
    await electronBuild({
      config: {
        files: ['build'],
        mac: {
          identity: null,
          target: ['dir'],
        },
      },
    });
  } else if (inputs.has('--github')) {
    await electronBuild({
      config: {
        files: ['build'],
        mac: {
          notarize: {
            teamId: process.env.APPLE_TEAM_ID,
          },
        },
      },
    });
  }
};
main();
