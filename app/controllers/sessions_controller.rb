class SessionsController < ApplicationController
    def new
    end

    def create
        @user = User.find_by_email(params[:email])
        render nothing: true
    end

    def destroy
    end

    private
        def user_params
            params.require(:users).permit(:email, :password_digest)
        end
end
