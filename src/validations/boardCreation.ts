type BoardCreationInput = {
  boardName: string;
  displayName: string;
};

type BoardCreationErrors = {
  boardName?: string;
  displayName?: string;
};

type BoardCreationValidationResult = {
  isValid: boolean;
  values: {
    boardName: string;
    displayName: string;
  };
  errors: BoardCreationErrors;
};

const BOARD_NAME_MAX_LENGTH = 120;
const DISPLAY_NAME_MAX_LENGTH = 60;

const validateBoardCreation = (
  input: BoardCreationInput,
): BoardCreationValidationResult => {
  const boardName = input.boardName.trim();
  const displayName = input.displayName.trim();
  const errors: BoardCreationErrors = {};

  if (!boardName) {
    errors.boardName = "Tahta adı zorunludur.";
  } else if (boardName.length > BOARD_NAME_MAX_LENGTH) {
    errors.boardName = `Tahta adı en fazla ${BOARD_NAME_MAX_LENGTH} karakter olabilir.`;
  }

  if (!displayName) {
    errors.displayName = "Görünen ad zorunludur.";
  } else if (displayName.length > DISPLAY_NAME_MAX_LENGTH) {
    errors.displayName =
      `Görünen ad en fazla ${DISPLAY_NAME_MAX_LENGTH} karakter olabilir.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    values: {
      boardName,
      displayName,
    },
    errors,
  };
};

export { validateBoardCreation };
