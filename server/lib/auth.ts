




export const encryptedPassword = async (password: string) => {
    try {
        const saltRounds = 10;
        const salt = await bycrypt.genSalt(saltRounds);
        const hashedPassword = await bycrypt.hash(password, salt);
        return hashedPassword;
        
  }
}