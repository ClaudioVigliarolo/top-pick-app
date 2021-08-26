import React from 'react';
import {HelpScreen} from '../interfaces/Interfaces';

export const HelpContext = React.createContext({
  help: HelpScreen.NO_SCREEN,
  setHelp: (value: HelpScreen) => {},
  setCurrentStep: (value: number) => {},
  currentStep: 0,
});

export const HelpProvider = ({children}: {children: React.ReactNode}) => {
  const [help, setHelp] = React.useState<HelpScreen>(HelpScreen.NO_SCREEN);
  const [currentStep, setCurrentStep] = React.useState<number>(0);

  const onSetHelp = (newVal: HelpScreen) => {
    setHelp(newVal);
  };

  const onSetCurrentStep = (newVal: number) => {
    setCurrentStep(newVal);
  };
  return (
    <HelpContext.Provider
      value={{
        help,
        setHelp: onSetHelp,
        currentStep,
        setCurrentStep: onSetCurrentStep,
      }}>
      {children}
    </HelpContext.Provider>
  );
};
