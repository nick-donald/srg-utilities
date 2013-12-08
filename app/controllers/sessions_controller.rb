class SessionsController < ApplicationController
    include SessionsHelper
    def new
    end

    def create
        user = User.find_by_email(params[:email])
        if (user && user.authenticate(params[:password]))
            sign_in user
            puts "logged in"
        else
            puts "no log"
        end
        render nothing: true
    end

    def destroy
        sign_out
        render nothing: true
    end

    def authenticate
        if params.has_key?(:remember_token)
            if user = User.find_by_remember_token(params[:remember_token])
                response = true
                admin = user.admin
            else
                response = false
                admin = false
            end
        else
            response = false
        end
        respond_to do |format|
            format.json { render json: {authenticated: response, admin: admin} }
        end
    end

    private
        def user_params
            params.require(:users).permit(:email, :password_digest)
        end
end
