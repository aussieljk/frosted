import { Box, Instance as InkInstance, Static, Text, render as inkRender } from 'ink';
import InkSpinner from 'ink-spinner';
import React from 'react';
import { IDiffSummary } from './types';

interface ICliState {
  fileKey?: string;
  spinners?: Array<{ success?: true; text: string }>;
  progress?: { text: string; percent: number };
  diff?: IDiffSummary[];
}

interface ICliViewProps {
  state: ICliState;
}

interface ISpinnerProps {
  text: string;
}

const Spinner = ({ text }: ISpinnerProps) => (
  <Box>
    <Text>
      <Text color="cyan">
        <InkSpinner />
      </Text>{' '}
      {text}
    </Text>
  </Box>
);

const CliView = ({ state }: ICliViewProps) => {
  return (
    <Box flexDirection="column">
      {state.fileKey && (
        <Static
          items={[
            <Box key="title" marginTop={1} marginBottom={1}>
              <Text bold>Generate Icon Lib </Text>
              <Text dimColor>(Figma File → NPM Package)</Text>
            </Box>,
            <Box key="fileKey" marginBottom={1}>
              <Text bold>Figma File: </Text>
              <Text underline color="magenta">
                {state.fileKey}
              </Text>
            </Box>,
          ]}
        >
          {(item) => item}
        </Static>
      )}

      {state.spinners && (
        <Box marginLeft={1} flexDirection="column">
          <Static items={state.spinners.filter((entry) => entry.success)}>
            {(entry) => (
              <Box marginLeft={1} key={entry.text}>
                <Text>
                  <Text color="green">✓</Text> {entry.text}
                </Text>
              </Box>
            )}
          </Static>
          {state.spinners
            .filter((entry) => !entry.success)
            .map((entry) => (
              <Spinner key={entry.text} text={entry.text} />
            ))}
        </Box>
      )}

      {state.progress && (
        <Box marginLeft={1}>
          <Spinner text={`${state.progress.text} [${Math.floor(state.progress.percent * 100)}%]`} />
        </Box>
      )}

      {state.diff && <DiffView state={state} />}
    </Box>
  );
};

const DiffView = ({ state }: ICliViewProps) => {
  const statsWithChanges = (state.diff ?? []).filter((stat) => stat.additions > 0 || stat.deletions > 0);
  const totals = {
    additions: statsWithChanges.reduce((total, stat) => stat.additions + total, 0),
    deletions: statsWithChanges.reduce((total, stat) => stat.deletions + total, 0),
  };
  return (
    <Static
      items={[
        <Box key="numstat-title" marginTop={1}>
          <Text bold>Summary of Update</Text>
        </Box>,
        <Box key="numstat-files" marginLeft={1} marginTop={1}>
          <Box flexDirection="column" flexGrow={0}>
            {statsWithChanges.map((stat) => (
              <Text key={stat.filePath} dimColor>
                {stat.filePath}
              </Text>
            ))}
          </Box>

          <Box flexDirection="column" flexGrow={0} paddingLeft={1}>
            {statsWithChanges.map((stat) => (
              <Text key={stat.filePath}>|</Text>
            ))}
          </Box>

          <Box flexDirection="column" justifyContent="flex-end" alignItems="flex-end" flexGrow={0} paddingLeft={1}>
            {statsWithChanges.map((stat) => (
              <Text key={stat.filePath}>{stat.additions + stat.deletions}</Text>
            ))}
          </Box>

          <Box flexDirection="column" paddingLeft={1}>
            {statsWithChanges.map((stat) => (
              <Box key={stat.filePath}>
                {stat.status === 'D' && <Text color="red">Removed</Text>}
                {stat.status === 'A' && <Text color="green">New</Text>}
                {stat.status === 'M' && stat.additions > 0 && stat.deletions === 0 ? <Text color="green">++</Text> : null}
                {stat.status === 'M' && stat.additions === 0 && stat.deletions > 0 ? <Text color="red">--</Text> : null}
                {stat.status === 'M' && stat.additions > 0 && stat.deletions > 0 ? (
                  <>
                    <Text color="green">+</Text>
                    <Text color="red">-</Text>
                  </>
                ) : null}
              </Box>
            ))}
          </Box>
        </Box>,
        <Box key="numstat-summary" marginLeft={1} marginTop={1}>
          <Text underline>
            {statsWithChanges.length} file updates, {totals.additions} additions <Text color="green">(+)</Text>,{' '}
            {totals.deletions} deletions <Text color="red">(-)</Text>
          </Text>
        </Box>,
      ]}
    >
      {(item) => item}
    </Static>
  );
};

let app: InkInstance | undefined;

export const render = (state: ICliState) => {
  if (app) {
    app.rerender(<CliView state={state} />);
  } else {
    app = inkRender(<CliView state={state} />);
  }
};
export const unmount = () => {
  if (app) {
    app.unmount();
  }
};
