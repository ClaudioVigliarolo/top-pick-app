import React from 'react';

export const HelpContext = React.createContext({
  isHelp: false,
  setHelp: (value: boolean) => {},
  setCurrentStep: (value: number) => {},
  currentStep: 0,
});

export const HelpProvider = ({children}: {children: React.ReactNode}) => {
  const [isHelp, setHelp] = React.useState<boolean>(false);
  const [currentStep, setCurrentStep] = React.useState<number>(0);

  const onSetHelp = (newVal: boolean) => {
    setHelp(newVal);
  };

  const onSetCurrentStep = (newVal: number) => {
    setCurrentStep(newVal);
  };
  return (
    <HelpContext.Provider
      value={{
        isHelp,
        setHelp: onSetHelp,
        currentStep,
        setCurrentStep: onSetCurrentStep,
      }}>
      {children}
    </HelpContext.Provider>
  );
};
