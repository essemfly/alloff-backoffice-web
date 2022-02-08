/* eslint-disable no-useless-escape */
const replace = require("replace-in-file");
const shell = require("shelljs");

const env = process.env.NODE_ENV ?? "dev"; // prod or dev
const apis = require(`./environments/${env}`);

const commonCustomizations = [
  {
    files: ["runtime.ts"],
    from: "GlobalFetch",
    to: "WindowOrWorkerGlobalScope",
  },
  {
    files: ["runtime.ts"],
    from: ".join(`&${encodeURIComponent(fullKey)}=`)", // eslint-disable-line
    to: ".join(`&${encodeURIComponent(fullKey)}[]=`)", // eslint-disable-line
  },
  {
    files: ["runtime.ts"],
    from: "${encodeURIComponent(fullKey)}=${multiValue}", // eslint-disable-line
    to: "${encodeURIComponent(fullKey)}[]=${multiValue}", // eslint-disable-line
  },
];

const fileHeader = `\/\/ @ts-nocheck`;

const apiClientsDir = "./src/api";

shell.rm("-r", apiClientsDir);

apis.forEach((api) => {
  const apiClientDir = `${apiClientsDir}`;

  shell.mkdir("-p", apiClientDir);
  shell.exec(
    [
      `openapi-generator-cli generate -i ${api.specLocation}`,
      "-g typescript-axios",
      `-o ${apiClientDir}`,
      "-c ./scripts/openapi-config.json",
      "--type-mappings date=string,object=any",
    ].join(" "),
  );
  shell.rm([
    `${apiClientDir}/.gitignore`,
    `${apiClientDir}/.openapi-generator-ignore`,
  ]);

  commonCustomizations.forEach((x) => {
    replace.sync({
      ...x,
      files: x.files.map((file) => `${apiClientDir}/${file}`),
    });
  });

  shell.ls(`${apiClientDir}/*.ts`).forEach((file) => {
    shell.exec(`echo "$(echo '${fileHeader}'; cat ${file})" > ${file}`);
  });
});
