class UsersController < ApplicationController

    def create
    end

    def new
        
    end

    def destroy
        
    end


    private
        def user_params
            params.require(:users).permit(:email, :password_digest)
        end
end
