class ApiError extends Error {
  status: number;
  constructor(status: number, message: string | undefined) {
    super(message);
    this.status = status;
  }
}

export default ApiError