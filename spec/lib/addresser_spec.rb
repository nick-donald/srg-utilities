require 'spec_helper'

describe ApiKeys do
    before(:each) do
        @dummy_class = Class.new { extend ApiKeys }
    end
end

describe AddresserHelper do
    before(:each) do
        @dummy_class = Class.new { extend Addresser }
    end

    describe "#addresser" do
        subject { @dummy_class.addresser("target", "chicago", 10) }

        context 'with good input' do
            context 'should return array' do
                its(:class) { should eq(Array) }
            end
            context 'should return status success' do
                sleep 0.5
                let(:info) { @dummy_class.addresser("target", "chicago", 10).first }

                specify { info['status'].should eq('OK') }
            end
        end

        context 'with bad input' do
            context 'should return status BAD REQUEST' do
                let(:info) { @dummy_class.addresser("target", "chicago", "b") }

                specify { info['status'].should eq('INVALID_REQUEST') }
            end
        end
    end
end