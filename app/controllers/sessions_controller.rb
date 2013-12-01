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
        ArticlesMailer.mail_articles.deliver
        render nothing: true
    end

    def destroy
        sign_out
        render nothing: true
    end

    def authenticate
        if params.has_key?(:remember_token)
            User.find_by_remember_token(params[:remember_token]) ? response = true : response = false
        else
            response = false
        end
        respond_to do |format|
            format.json { render json: {authenticated: response} }
        end
    end

    private
        def user_params
            params.require(:users).permit(:email, :password_digest)
        end
end
